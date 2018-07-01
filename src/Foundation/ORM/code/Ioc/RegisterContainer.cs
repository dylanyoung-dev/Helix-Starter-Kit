using Glass.Mapper.Sc;
using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Helix.Foundation.ORM.Ioc
{
    public class RegisterContainer : IServicesConfigurator
    {
        public void Configure(IServiceCollection serviceCollection)
        {
            ServiceProvider serviceProvider = serviceCollection.BuildServiceProvider();

            serviceCollection.AddTransient<ISitecoreContext>(provider => new SitecoreContext());
        }
    }
}