@ECHO off

if [%1]==[init] goto init
if [%1]==[create] goto create

COLOR 07
CLS

echo Executing %1

:init

echo Running NPM Install...
call npm install

echo Changing Path...
cd .\generators

echo Configuring NPM Link (Yeoman)...
call npm install
call npm link

:create

echo Creating Module with Yeoman...
call yo starter