using Glass.Mapper.Sc.Web.Mvc;
using Sitecore.Mvc.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Helix.Foundation.ORM.Controllers
{
    public class BaseController : SitecoreController
    {
        private readonly IMvcContext _context;

        public BaseController(IMvcContext context)
        {
            _context = context;
        }
    }
}