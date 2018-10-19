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

To get started with this solution, you need to clone the repository and move to a folder where your new solution will live.  Once you've placed it there, you should run the following commands in the repository, using your favorite command line tool:

    c:\> starter init

This will install all the node, yeoman and other pre-requisites on your local machine to run the latest version of Sitecore 9.0.2.  You will need to install a local copy of Sitecore 9.0.2 locally.

> Coming Soon we will also setup Sitecore in your local environment.

## Getting Started

The purpose to this repository, is to allow a trimmed down solution, that only includes development acceleration to increase productivity when creating a solution for either your website solution or component for the Sitecore marketplace.  If you are looking to contribute, just make sure you keep that simple fact in mind.

### New Modules

If you need to add a new module (which is a standard procedure when using a starter kit), this solution includes support for Yeoman, which is a Node JS package that allows you to create templated scaffolding for anything you need.  

You can initialize the module creation process by either running the following command in your favorite command line tool:

    c:\> starter create-module

Or you can use the Yeoman command:

    c:\> yo starter

## Contribution

Learn more about contributing to this project on our [Contribution Guidelines](Contributing.md) pages.