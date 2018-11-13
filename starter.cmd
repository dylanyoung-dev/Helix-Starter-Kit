@ECHO off

if [%1]==[setup] goto setup
if [%1]==[run] goto run

COLOR 07
CLS

echo Executing %1

:setup

echo Running NPM Install...
call npm install

REM echo Changing Path...
cd .\generators

echo Configuring NPM Link (Yeoman)...
call npm link

REM Change Path back to Root
cd ..\

goto :eof

:run

echo Initializing Solution with Yeoman...
call yo starter

goto :eof