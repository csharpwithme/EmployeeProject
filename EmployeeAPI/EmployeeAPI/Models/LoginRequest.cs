namespace EmployeeAPI.Models
{
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    // Models/LoginResponse.cs
    public class LoginResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Token { get; set; }  // optional JWT token
    }
}
