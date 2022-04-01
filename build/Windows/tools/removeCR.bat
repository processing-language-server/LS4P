@echo off
SetLocal DisableDelayedExpansion

for /f "tokens=*" %%a in ('find /n /v "" ^< %1') do (
    set line=%%a
    SetLocal EnableDelayedExpansion
    set line=!line:*]=!

    rem "set /p" won't take "=" at the start of a line....
    if "!line:~0,1!"=="=" set line= !line!
    
    rem there must be a blank line after "set /p"
    rem and "<nul" must be at the start of the line
    set /p =!line!^

<nul
    endlocal
) >> temp.txt

copy temp.txt %1 1>nul
del temp.txt 2>nul

for %%f in (%1) do set LastPartOfFolder=%%~nxf

echo Created "no CR" file %LastPartOfFolder%