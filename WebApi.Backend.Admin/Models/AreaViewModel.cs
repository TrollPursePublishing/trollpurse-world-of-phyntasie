using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Backend.Admin.Models
{
    public class AreaViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public List<Guid> LocationIds { get; set; }
    }
}