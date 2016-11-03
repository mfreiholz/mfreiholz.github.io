+++
date = "2016-10-16T11:25:14+02:00"
title = "Make a class thread safe C++"
author = "mfreiholz"
tags = ["Development", "Tutorial", "C++"]
+++

You might have come across the case, that you had a simple class which got the new requirement to be thread-safe for upcoming use-cases. I have seen developers who simple wrapped all methods with a locked mutex, like this:<!--more-->

```cpp
void MyClass::set(T val)
{
	mutex.lock();
	_val = val;
	mutex.unlock();
}
```

In a lot of cases this will work well and you don’t have to worry about parallel access on class members. But there are some scenarios, where this simple approach does not help, instead it might critically crash your program.

I will show you a use-case with a simple *Cache* class.

## Single threaded, non-(b)locking

First I will show the basic implementation from where we start. A simple `Cache1` class, which is meant to be used from one thread and does not use any mutex- or spin-locks.

```cpp
class Cache1
{
	std::map<int, std::shared_ptr<CacheData> > _map;

public:
	bool contains(int key) const
	{
		return _map.find(key) != _map.end();
	}

	std::shared_ptr<CacheData> get(int key) const
	{
		return _map.at(key);
	}

	void insert(int key, std::shared_ptr<CacheData> value)
	{
		_map.insert(std::make_pair(key, value));
	}
};
```

In addition to the class here is a small code sample, which shows the way the cache is beeing used.

```cpp
int main(int argc, char** argv)
{
	// fill cache
	Cache1 cache;
	cache.insert(1, std::make_shared<CacheData>(1024));
	cache.insert(2, std::make_shared<CacheData>(2048));

	// get objects from cache and access methods of them
	if (cache.contains(1))
	{
		assert(cache.get(1)->size() == 1024);
	}
	if (cache.contains(2))
	{
		assert(cache.get(2)->size() == 2048);
	}
}
```

Here you can see, that the `main()` implementation uses two steps to retrieve the cached value. First it checks whether it is available with `contains()` and then retrieves the value with `get()`. In an environment where the `Cache1` is only accessed by a single thread everything works just fine.

*There might be some missing validation checks and capacity regulations in the `Cache1` class, but that is not the topic of this article.*

## Thread-safe, but not atomic

Lets see how it looks, when we apply the above mentioned simple way to make the class thread-safe.

```cpp
class Cache2
{
	mutable std::mutex _mtx;
	std::map<int, std::shared_ptr<CacheData> > _map;

public:
	bool contains(int key) const
	{
		std::lock_guard<std::mutex> l(_mtx);
		bool b = _map.find(key) != _map.end();
		return b;
	}

	std::shared_ptr<CacheData> get(int key) const
	{
		std::lock_guard<std::mutex> l(_mtx);
		std::shared_ptr<CacheData> val = _map.at(key); // can throw an std::exception
		return val;
	}

	void insert(int key, std::shared_ptr<CacheData> value)
	{
		std::lock_guard<std::mutex> l(_mtx);
		_map.insert(std::make_pair(key, value));
	}
};
```

I only added a new [`std::mutex`](http://www.cplusplus.com/reference/mutex/mutex/) as class member and wrapped each method implementation with `_mtx.lock()` and `_mtx.unlock()`. This does make all access on the internal [`std::map`](http://www.cplusplus.com/reference/map/map/) absolutely thread-safe. The `Cache2` itself is now no longer the problem. The problem comes with the way the class is being used, because it still uses the same `main()` implementation:

```cpp
int main(int argc, char** argv)
{
	// fill cache
	Cache2 cache;
	cache.insert(1, std::make_shared<CacheData>(1024));
	cache.insert(2, std::make_shared<CacheData>(2048));

	// get objects from cache and access methods of them
	if (cache.contains(1))
	{
		assert(cache.get(1)->size() == 1024);
	}
	if (cache.contains(2))
	{
		assert(cache.get(2)->size() == 2048);
	}
}
```

You might wonder, what could go wrong, even if two classes access the `Cache2` at the same time, the class is thread-safe though.

Even this is right, but looking closer in consideration of the `main()` implementation the code unveils some nasty behavior, which will crash the program under certain conditions. So whats the deal?

Lets imaging you have two threads: One inserts and reads (`get()`) values and the second thread removes values from cache. Now the following order may happen:

- Thread #1: Insert "1"
- Thread #1: Insert "2"
- Thread #1: Checks with `contains(1)` and returns `true`
- Thread #2: Removes "1"
- Thread #1: Gets object "1" from cache and calls a method on tries to access an attribute; **Crash!!!**

Here is the problematic piece of code again:

```cpp
	if (cache.contains(1))
	{
		// -> here thread #2 removes value "1"
		// -> this is possible because the `Cache2::_mtx` is no longer locked
	
		// now thread #1 directly accesses the no longer existing object and crashes
		assert(cache.get(1)->size() == 1024);
	}
```

As you can see, because the two calls to `contains()` and `get()` are not atomic is why this `Cache2` implementation is not really thread-safe.

> **Side node:** In reality the crash would already happen inside `Cache2::get()`, because [`std::map::at()`](http://www.cplusplus.com/reference/map/map/at/) method throws an exception, if the key is not available.

## Thread-safe locking, the right way

Now we take a look at an implementation, which is not only thread-safe but also atomic with all of its methods.

```cpp
class Cache3
{
	mutable std::mutex _mtx;
	std::map<int, std::shared_ptr<CacheData> > _map;

public:
	std::shared_ptr<CacheData> get(int key) const
	{
		std::lock_guard<std::mutex> l(_mtx);
		std::map<int, std::shared_ptr<CacheData> >::const_iterator it;
		if ((it = _map.find(key)) != _map.end())
		{
			auto val = it->second;
			return val;
		}
		return std::shared_ptr<CacheData>();
	} // auto unlock (lock_guard, RAII)

	void insert(int key, std::shared_ptr<CacheData> value)
	{
		std::lock_guard<std::mutex> l(_mtx);
		_map.insert(std::make_pair(key, value));
	} // auto unlock (lock_guard, RAII)
};
```

The important change here is, that the check whether a value is in cache, is within the same LOCK as the method to retrieve the cached value. But not only the class changes, also the implementation of the `main()` needs to be different now.

```cpp
int main(int argc, char** argv)
{
	// fill cache
	Cache3 cache;
	cache.insert(1, std::make_shared<CacheData>(1024));
	cache.insert(2, std::make_shared<CacheData>(2048));

	// get objects from cache and access methods of them
	std::shared_ptr<CacheData> val;

	val = cache.get(1);
	if (val)
	{
		assert(val->size() == 1024);
	}

	val = cache.get(2);
	if (val)
	{
		assert(val->size() == 2048);
	}
}
```

Instead of calling two methods of `Cache3`, you only need to call `get()`. The return value will be valid, if it is cached or invalid if it is not in cache. You can add an `contains()` method again, of course, but never expect that `get()` returns a valid value as next statement.

This was only a small example to show what can go wrong with thread-safe programming, but I hope it could help a bit.

Sources on GitHub: <https://github.com/mfreiholz/post-threadsafeclass>

# Update notes
- Because of some feedback, I decided to use `std::lock_guard` for safe RAII based mutex locking. I didn't use it in the first place, because I thought it could be more transparent for presentation purpose to use basic `std::mutex::lock()` and `std::mutex::unlock()` calls. *Bret Kuns* made it clear to me, that a reader have to understand RAII and it's better to let the user google for it before showing it the wrong way.