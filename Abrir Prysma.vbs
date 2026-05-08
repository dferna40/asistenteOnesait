Set shell = CreateObject("WScript.Shell")
command = "powershell -ExecutionPolicy Bypass -File """ & Replace(WScript.ScriptFullName, "Abrir Prysma.vbs", "scripts\start-app.ps1") & """"
shell.Run command, 0, False
