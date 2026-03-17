{{- define "chatapp.name" -}}
{{ .Chart.Name }}
{{- end }}

{{- define "chatapp.fullname" -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end }}