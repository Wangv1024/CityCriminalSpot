using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace SpotBackEndApi.Models
{
    public class DataBaseContext
    {
        public string ConnectionString { get; set; }

        public DataBaseContext( string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }

        public List<CriminalEntry> GetEntryById(String id)
        {
            if (id.Length == 0)
                return new List<CriminalEntry>();

            id = " where incident_id = " + id;
            return GetEntry( id );
        }

        public List<CriminalEntry> GetEntryByOptions(SearchOptions Options)
        {
            
            return GetEntry(Options.parseOptons());
        }

        private List<CriminalEntry> GetEntry(String cmdString)
        {
            List<CriminalEntry> list = new List<CriminalEntry>();

            using ( MySqlConnection conn = GetConnection() )
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand( "Select * From tmp2017 " + cmdString + " ;" , conn );

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new CriminalEntry()
                        {
                            Incident_id = reader.GetUInt32("incident_id"),
                            Incident_date = reader.GetDateTime("incident_date").ToShortDateString(),
                            Type = reader.GetString("parent_incident_type"),
                            Description = reader.GetString("incident_description"),
                            Hours = reader.GetInt16("hour_of_day"),
                            Latitude = reader.GetDouble("latitude"),
                            Longitude = reader.GetDouble("longitude"),
                            Address = reader.GetString("address_1"),
                            City = reader.GetString("city"), 
                            State = reader.GetString("state"),
                            Zip = reader.GetString("zip")
                        });
                    }
                }

            }
            return list;
        } 
    }
}
