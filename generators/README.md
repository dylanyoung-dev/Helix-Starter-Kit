# Generator Documentation

In this document we will highlight the basics of what makes this Helix Starter Kit so powerful.

## Variables

### Global

These are variables that will be used in both `Solution Initialization` and `Creating a Module`.

Variable Name | Object Type | Example | Description
--- | --- | --- | ---
SitecoreVersion | String | 9.0.2
SolutionPrefix | String | `Helix`.Foundation.Serialization | Prefix in all project names.

### Solution Initialization

Variable Name | Object Type | Example | Description
--- | --- | --- | ---
SolutionName | String | `HelixStarter`.sln | The name of your sln solution file.
EnvironmentUrl | String | https://starterkit.sc
EnvironmentRoot | String | c:\inetpub\wwwroot\starterkit.sc
SolutionType | String | Base | Can be one of three types: `Base`, `Module`, `Website`

### Module

Variable Name | Object Type | Example | Description
--- | --- | --- | ---
ModuleType | String | Project | Can be one of three types: `Foundation`, `Feature`, `Project`
ModuleName | String | Blog | The name of your module



### General Variables

Variable Name | Object Type | Example | Description
--- | --- | --- | ---
SourceRoot | String | c:\code\helix-starter-kit | Path to the `destinationPath` of the template being generated.
VersionOptions | Object | * | Used for creation of Projects and Module Dependency references