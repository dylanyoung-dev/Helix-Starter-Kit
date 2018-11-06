@ECHO off

if [%1]==[init] goto init
if [%1]==[create] goto create

COLOR 07
CLS

echo Executing %1

:init

echo Running NPM Install...
call npm install

REM echo Changing Path...
cd .\generators

echo Configuring NPM Link (Yeoman)...
call npm link

REM Change Path back to Root
cd ..\

goto :eof

:create

echo Initializing Solution with Yeoman...
call yo starter

goto :eof