# Helix Starter Kit

This is a Helix Starter Kit.  This is the first true Starter Kit for building any sort of Helix based Sitecore project.  I built this with the intention that you could use this for module development as well as for a full blown Sitecore website.  If you are starting a Sitecore project, and you want to hit the ground running without having to start by removing things that your solution doesn't need, this project is for you.  If you still want more, there will eventually be more repositories that are based on this for those style of projects.

The solution has the following 

    - Helix
	- .Net MVC 5.2.3
	- Sitecore 9.0.1
	- Unicorn 4.0.3
	- Glass Mapper 5
	- Leprechaun 
	- Microsoft.Extensions.DependencyInjection 1.0

## Installation

To get started with installing the Sitecore Starter Kit, get the latest from this repository by cloning. Then run the following steps:



## Architecture

The standard installation uses Sitecore Helix best practices (Sitecore Helix).  To keep things minimalistic, we only have Foundation and Project layer modules by default.  The foundation modules, help with the standard things you might need in a simplistic solution, including an ORM (Glass Mapper), Search (using the Content Search Api), Unicorn for keeping track of your Sitecore changes, and an Inversion of Control Container (using the default Sitecore 8.2+ IoC Container).  The project layer contains one project, which contains the bare essentials needed to run and configure your Sitecore site for module development or building a full blown website.

## Build & Release

Coming Soon

## Testing

Coming Soon

## Extending

Building off of this Starter Kit, is meant to be extremely easy.  Pull down the source to start your project, and then use this as a starting point for your next project.  Coming soon will be the features to automatically scaffold projects for any specific layer or to create a new site definition.

## Contribution

Refer to the [Issues Page](https://github.com/sitecoremaster/Helix-Starter-Kit/issues) for items that are un-assigned and are good starting projects for contributors.