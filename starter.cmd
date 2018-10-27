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

REM Run Gulp Initialize
gulp init --Url [%2] --SitecoreRoot [%3]

goto :eof

:create

echo Creating Module with Yeoman...
call yo starter

goto :eof