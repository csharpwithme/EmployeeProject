using EmployeeAPI.Models;
using EmployeeAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly EmployeeRepository _employeeRepository;

        public ProfileController()
        {
            _employeeRepository = new EmployeeRepository();
        }

        // GET: api/Profile/me
        [HttpGet("me")]
        public IActionResult GetMyProfile()
        {
            // For now, hardcode userId = 1
            int userId = 1;

            var employee = _employeeRepository.GetEmployeeById(userId);

            if (employee == null)
                return NotFound("Profile not found.");

            return Ok(employee);
        }
        //public IActionResult GetProfile()
        //{
        //    // Get EmployeeId from JWT token or claims
        //    int userId = int.Parse(User.FindFirst("EmployeeId").Value);

        //    var emp = _repo.GetEmployeeById(userId);
        //    if (emp == null) return NotFound();
        //    return Ok(emp);
        //}
        [HttpPut("me")]
        [Authorize]
        public IActionResult UpdateProfile(Employee emp)
        {
            int userId = int.Parse(User.FindFirst("EmployeeId").Value);
            emp.EmployeeId = userId;

            bool result = _employeeRepository.UpdateProfile(emp);
            if (!result) return BadRequest("Failed to update profile");

            return Ok(emp);
        }
    }
}