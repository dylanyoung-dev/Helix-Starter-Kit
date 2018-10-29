using Glass.Mapper.Sc.Configuration.Attributes;
using Glass.Mapper.Sc.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Helix.Foundation.ORM.Models
{
    public interface IGlassBase
    {
        [SitecoreInfo(SitecoreInfoType.OriginatorId)]
        Guid Id { get; set; }

        [SitecoreInfo(SitecoreInfoType.Name)]
        string ItemName { get; set; }

        [SitecoreInfo(SitecoreInfoType.Language)]
        string Language { get; set; }

        [SitecoreInfo(SitecoreInfoType.Version)]
        int Version { get; set; }
    }
}
