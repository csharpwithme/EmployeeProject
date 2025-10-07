using EmployeeAPI.Models;
using EmployeeAPI.Repository;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers
{
    [Route("api/employee")]
    [ApiController]
    public class EmployeeAPIController : ControllerBase
    {
        private readonly EmployeeRepository _repo;

        public EmployeeAPIController(EmployeeRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_repo.GetAllEmployees());

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var emp = _repo.GetEmployeeById(id);
            if (emp == null) return NotFound();
            return Ok(emp);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Employee emp)
        {
            if (emp == null) return BadRequest("Employee is null");
            return _repo.InsertEmployee(emp) ? Ok() : BadRequest("Insert failed");
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Employee emp)
        {
            if (emp == null) return BadRequest("Employee is null");
            emp.EmployeeId = id;
            return _repo.UpdateEmployee(emp) ? Ok() : BadRequest("Update failed");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return _repo.DeleteEmployee(id) ? Ok() : BadRequest("Delete failed");
        }
    }
}
