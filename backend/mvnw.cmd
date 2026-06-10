@echo off
setlocal

SET DIRNAME=%~dp0
IF "%DIRNAME%"=="" SET DIRNAME=.

SET WRAPPER_JAR=%DIRNAME%.mvn\wrapper\maven-wrapper.jar
SET WRAPPER_PROPERTIES=%DIRNAME%.mvn\wrapper\maven-wrapper.properties

@REM Download wrapper jar if missing
IF NOT EXIST "%WRAPPER_JAR%" (
    FOR /F "tokens=1,2 delims==" %%A IN (%WRAPPER_PROPERTIES%) DO (
        IF "%%A"=="wrapperUrl" (
            echo Downloading Maven Wrapper...
            powershell -Command "Invoke-WebRequest -Uri '%%B' -OutFile '%WRAPPER_JAR%' -UseBasicParsing"
        )
    )
)

@REM Detect java executable
IF DEFINED JAVA_HOME (
    SET JAVA_EXE=%JAVA_HOME%\bin\java.exe
) ELSE (
    SET JAVA_EXE=java
)

@REM Execute the wrapper
"%JAVA_EXE%" -jar "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%DIRNAME%" %*
SET MVNW_ERRORLEVEL=%ERRORLEVEL%

endlocal
EXIT /B %MVNW_ERRORLEVEL%
