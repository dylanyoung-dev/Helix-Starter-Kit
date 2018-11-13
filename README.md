# Helix Starter Kit

This is a Helix Starter Kit.  What makes it different than Habitat, Habitat Home or Helixbase? Well it's simple, those aren't truly built to be starter kits for your development project.  We provide bear essentials and allow you the development manager to decide where you want to take this tool.  It's great for smaller projects that can include component development for the Sitecore marketplace, or as big of projects as multiple sites running in a Sitecore instance.

We've made some assumptions, that you can use for your project that you are starting.  But don't worry, if you are looking for a Helix starter kit that uses a didn't ORM Wrapper/Mapper or a different tool for serializing items, we are working on different projects coming soon that are based on different technology stacks.

    > Sitecore Helix [Helix Documentation](https://helix.sitecore.net)
	> .Net MVC 5.2.3
	> Sitecore 9.0.2
	> Unicorn
	> Glass Mapper 5
	> Yeoman for module creation
	> Leprechaun for template class generation

In addition, it includes scaffolding and developer enhancements, to make development quicker.  To learn more about these enhancements, please read more about these commands that you can run in the `Getting Started` section.

## Installation

To get started using this solution as a starting point for your Sitecore project, download the latest release from the Github Release page.

Then unzip the package with the name of the project that you plan to use.  The files that you now have on your file system contain the essential building blocks so that you can start setting up your Sitecore solution.

To get started with this solution, you need to clone the repository and move to a folder where your new solution will live.  Once you've placed it there, you should run the following commands in the repository, using your favorite command line tool:

    c:\> .\starter init

This will install all the node, yeoman and other pre-requisites on your local machine to run the latest version of Sitecore 9.0.2.  You will need to install a local copy of Sitecore 9.0.2 locally.

## Getting Started

Once you've go the core folder structure in place, you will need to initialize the npm install, plus any other pre-requisites.  To do this, just run the following bath command:

    c:\> .\starter setup

Once that completes, you should be ready to run the Yeoman solution initialization process, which will run and setup your Sitecore Visual Studio solution based on settings that you specify during the guided commands.  To start the guided commands using Yeoman, run the following batch command in your favorite command line tool in the root folder:

    c:\> .\starter run

This will initialize the Yeoman generator which will provide you with the simple option to either `Initialize Solution` or `Create Helix Module`.  If this is your first time running this command, make sure you select `Initialize Solution` before you start creating your own Helix Modules.

The Initialization of the Sitecore solution contains 3 different types of solutions:

You can setup a `Base` install which will only contain the very bare essentials for a Sitecore Visual Studio solution with limited projects.

There is a `Website` focused solution, which contains a little more projects in your solution focused towards getting you started building a website focused solution.

And lastly, there is a `Module` focused solution, which is there to help those that are building a Sitecore module for the marketplace.

In the future we will build additional solution types that include the pieces that make sense for those scenarios.

Once you've selected your solution types, you will be presented with various other options to help setup your local Visual Studio solution, this will include gulp configurations, publish settings and more.  Once you are done, you should now see a bunch of new root items as well as a new `src` folder.  

Once you get to this point, I would recommend committing your changes and then you can proceed with your Sitecore website setup and moving on to the next section on building custom Helix modules.

### New Modules

If you need to add a new module, it's now super simple to do this, just by running a simple batch command:

    c:\> .\starter run

Once you trigger that command, it will ask you a series of questions to determine the layer and naming of the module.  This command will also insert the project into your current solution that you previously created in the Getting Started section.

## Video Training

I am working on putting together a video training guide on how to use this Starter Kit to get up and running quickly on a Project.

## Contribution

Learn more about contributing to this project on our [Contribution Guidelines](docs\Contributing.md) pages.

