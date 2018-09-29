using Glass.Mapper.Sc;
using Glass.Mapper.Sc.Web;
using Glass.Mapper.Sc.Web.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Sitecore.Data;
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
            // From Corey Smith's Blog: https://www.coreysmith.co/glass-mapper-5-dependency-injection/

            // For getting a SitecoreService for any database
            serviceCollection.AddSingleton<Func<Database, ISitecoreService>>(_ => CreateSitecoreService);

            // For injecting into Controllers (MVC Only)
            serviceCollection.AddScoped(_ => CreateSitecoreContextService());
            serviceCollection.AddScoped(_ => CreateRequestContext());
            serviceCollection.AddScoped(_ => CreateGlassHtml());
            serviceCollection.AddScoped(_ => CreateMvcContext());

            // For injecting into Configuration Factory types like pipeline processors
            serviceCollection.AddSingleton<Func<ISitecoreService>>(_ => Get<ISitecoreService>);
            serviceCollection.AddSingleton<Func<IRequestContext>>(_ => Get<IRequestContext>);
            serviceCollection.AddSingleton<Func<IGlassHtml>>(_ => Get<IGlassHtml>);
            serviceCollection.AddSingleton<Func<IMvcContext>>(_ => Get<IMvcContext>);
        }

        private static ISitecoreService CreateSitecoreService(Database database)
        {
            return new SitecoreService(database);
        }

        private static ISitecoreService CreateSitecoreContextService()
        {
            var sitecoreServiceThunk = Get<Func<Database, ISitecoreService>>();

            return sitecoreServiceThunk(Sitecore.Context.Database);
        }

        private static T Get<T>()
        {
            return ServiceLocator.ServiceProvider.GetService<T>();
        }

        private static IRequestContext CreateRequestContext()
        {
            return new RequestContext(Get<ISitecoreService>());
        }

        private static IGlassHtml CreateGlassHtml()
        {
            return new GlassHtml(Get<ISitecoreService>());
        }

        private static IMvcContext CreateMvcContext()
        {
            return new MvcContext(Get<ISitecoreService>(), Get<IGlassHtml>());
        }
    }
}