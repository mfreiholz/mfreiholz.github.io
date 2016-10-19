+++
title = "hugo two column list template"
draft = true
date = "2016-10-19T07:18:46+02:00"

+++

I've been using [Hugo](#) static site generation since a while now.

```go
{{ $list := .Data.Pages }}
{{ $length := len $list }}
{{ $lastPostIndex := sub $length 1 }}
{{ range $i, $e := $list }}

	{{ if eq (mod $i 2) 0 }}
	<div class="row">
	{{ end }}

		<div class="col-md-6">
			Column Content Here!
		</div>

	{{ if or (eq (mod $i 2) 1) (eq $i $lastPostIndex) }}
	</div>
	{{ end }}

{{ end }}
```