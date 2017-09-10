using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpotBackEndApi.Models
{
    public class SearchOptions
    {
        public uint? Id { get; set; }
        public string[] Zip { get; set; } 
        public string[] Type { get; set; }
        public int? StartHour { get; set; } = 12;
        public int? EndHour { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string parseOptons()
        {
            List<string> Container = new List<string>();
            if( Id != null)
            {
                Container.Add( " incident_id = " + Id + " ");
            }

            if (Zip != null)
            {
                Container.Add(PacketArray("zip", Zip));
            }

            if (Type != null)
            {
                Container.Add(PacketTypeArray(Type));
            }
         


            ///   Parse Hour field:
            if (StartHour != null && EndHour != null)
            {
                Container.Add(" hour_of_day >= " + StartHour + " ");
                Container.Add(" hour_of_day <= " + EndHour + " ");
            }
            else if (StartHour != null)
            {
                Container.Add(" hour_of_day = " + StartHour + " ");
            }


            ///   Parse Date time field:          

            if (StartDate != null && EndDate != null)
            {
                Container.Add(" incident_date >= '" + StartDate.GetValueOrDefault().Date.ToString("yyyyMMdd") + "' ");
                Container.Add(" incident_date <= '" + EndDate.GetValueOrDefault().Date.ToString("yyyyMMdd") + "' ");
            }
            else if(StartDate != null)
            {
                Container.Add(" incident_date = '" + StartDate.GetValueOrDefault().Date.ToString("yyyyMMdd") + "' ");
            }


            return " where " + string.Join("AND", Container) ;

        }

        private string PacketArray(string ParaName, String[] ArrayInput)
        {
            return " " + ParaName + " IN (" + "'" + string.Join("', '", ArrayInput) + "') "; 
        }

        private string PacketTypeArray( String[] ArrayInput)
        {
            return " parent_incident_type REGEXP " + "'" + string.Join("|", ArrayInput) + "' ";
        }
    }
}
