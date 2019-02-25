# Helix Starter Kit

[![Build status](https://sitecoremaster.visualstudio.com/Helix%20Starter%20Kit/_apis/build/status/Helix%20Starter%20Kit-CI)](https://sitecoremaster.visualstudio.com/Helix%20Starter%20Kit/_build/latest?definitionId=2)

This is a Helix Starter Kit.  What makes it different than Habitat, Habitat Home or Helixbase? Well it's simple, those aren't truly built to be starter kits for your development project.  We provide bear essentials and allow you the development manager to decide where you want to take this tool.  It's great for smaller projects that can include component development for the Sitecore marketplace, or as big of projects as multiple sites running in a Sitecore instance.

We've made some assumptions, that you can use for your project that you are starting.  But don't worry, if you are looking for a Helix starter kit that uses a didn't ORM Wrapper/Mapper or a different tool for serializing items, we are working on different projects coming soon that are based on different technology stacks.

    > Sitecore Helix [Helix Documentation](https://helix.sitecore.net)
	> .Net MVC 5.2.3
	> Sitecore 9+
	> Unicorn
	> Glass Mapper 5
	> Yeoman for module creation
	> Leprechaun for template class generation

In addition, it includes scaffolding and developer enhancements, to make development quicker.  To learn more about these enhancements, please read more about these commands that you can run in the `Getting Started` section.

## Installation

To get started using this solution as a starting point for your Sitecore project, download the latest release from the Github Release page.

Then unzip the package with the name of the project that you plan to use.  The files that you now have on your file system contain the essential building blocks so that you can start setting up your Sitecore solution.

To get started with this solution, you need to clone the repository and move to a folder where your new solution will live.  Example, if I worked for ABC Widgets, I would potentially have a folder where I typically place all of my Git repositories, such as `C:\Development`, so for the ABC Widget project, I would create a new folder called `ABC` and place all of the files in that folder, so I would have something like `C:\Development\ABC\` and you would see the following in that folder:



#### Update Configuration

Once your folder structure is setup, you next need to configure your yaml configuration.  The yaml configuration is used to shorten and enhance the experience of initializing the solution and creating subsequent modules for your Sitecore instance.  There are two configuration files that live under the `generators` folder in your repository:

  - config.local.example.yml
  - config.yaml

The main config.yaml is where you should place configuration specific to the repository.  So all of the developers on your team will have the same settings in this config.yaml and it will be committed to source control.  If you want to test out specific differences from the main configuration, you can rename `config.local.example.yaml` to `config.local.yaml`. The gitignore file, will automatically ignore this configuration file, so that you can make those changes locally without an issue.

The configuration file allows you to specify default values for Prompts that come up during the `run` command that you will use below.  When setting up your instance, you should specify the following variables before you run your first `.\starter run` command.



## Getting Started

Once you've got the core folder structure in place, you will need to initialize the npm install, plus any other pre-requisites.  To do this, just run the following batch command:

    c:\> .\starter setup

Once that completes, you should be ready to run the solution initialization process, which will run and setup your Sitecore Visual Studio solution based on settings that you specify during the guided commands (or based on configuration specified in the `config.yaml` file).  To start the guided commands, run the following batch command in your favorite command line tool in the root folder:

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

