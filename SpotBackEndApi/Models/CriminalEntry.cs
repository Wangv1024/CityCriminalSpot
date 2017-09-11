using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpotBackEndApi.Models
{
    public class CriminalEntry
    {
        public uint Incident_id { get; set; }
        public string Incident_date { get; set; }
        public string Type { get; set; }   // parent_incident_type
        public string Description { get; set; }  // incident_description
        public int Hours { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
    }
}
