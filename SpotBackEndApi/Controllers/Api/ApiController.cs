using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SpotBackEndApi.Models;

namespace SpotBackEndApi.Controllers.Api
{
 //   [Route("api/record")]
    public class ApiController : Controller
    {
        //   [HttpGet("/test")]
        [HttpGet("api/record/{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                string incident_id = id;
                DataBaseContext context = HttpContext.RequestServices.GetService(typeof(DataBaseContext)) as DataBaseContext;
                List<CriminalEntry> res = context.GetEntryById(incident_id);

                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest("Fail to request data: " + e.Message);
            }
            
        }

        [HttpGet("api/")]
        public IActionResult Get([FromQuery] SearchOptions options)
        {
            try
            {
                
                DataBaseContext context = HttpContext.RequestServices.GetService(typeof(DataBaseContext)) as DataBaseContext;

     //           String queryString = options.parseOptons();

                List<CriminalEntry> res = context.GetEntryByOptions(options);

                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest("Fail to request data: " + e.Message);
            }

        }  
    }
}
