using EmployeeAPI.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeAPI.Repository
{
    public class EmployeeRepository
    {
        private readonly string _connectionString = "Server=DESKTOP-QCTUJPB\\SQLSERVER;Database=EmployeeCoreMVC;User ID=Anu;Password=@dmin;Trusted_Connection=True;TrustServerCertificate=True;";

        public List<Employee> GetAllEmployees()
        {
            var list = new List<Employee>();
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("sp_GetAllEmployees", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(new Employee
                    {
                        EmployeeId = (int)reader["EmployeeId"],
                        Name = reader["Name"].ToString(),
                        Email = reader["Email"].ToString(),
                        Department = reader["Department"].ToString(),
                        Salary = (decimal)reader["Salary"]
                    });
                }
            }
            return list;
        }

        public Employee GetEmployeeById(int id)
        {
            Employee emp = null;
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("sp_GetEmployeeById", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@EmployeeId", id);
                con.Open();
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    emp = new Employee
                    {
                        EmployeeId = (int)reader["EmployeeId"],
                        Name = reader["Name"].ToString(),
                        Email = reader["Email"].ToString(),
                        Department = reader["Department"].ToString(),
                        Salary = (decimal)reader["Salary"]
                    };
                }
            }
            return emp;
        }

        public bool InsertEmployee(Employee emp)
        {
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("sp_InsertEmployee", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Name", emp.Name);
                cmd.Parameters.AddWithValue("@Email", emp.Email);
                cmd.Parameters.AddWithValue("@Department", emp.Department);
                cmd.Parameters.AddWithValue("@Salary", emp.Salary);
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool UpdateEmployee(Employee emp)
        {
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("sp_UpdateEmployee", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@EmployeeId", emp.EmployeeId);
                cmd.Parameters.AddWithValue("@Name", emp.Name);
                cmd.Parameters.AddWithValue("@Email", emp.Email);
                cmd.Parameters.AddWithValue("@Department", emp.Department);
                cmd.Parameters.AddWithValue("@Salary", emp.Salary);
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool DeleteEmployee(int id)
        {
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("sp_DeleteEmployee", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@EmployeeId", id);
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
        public bool UpdateProfile(Employee emp)
        {
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("sp_UpdateProfile", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@EmployeeId", emp.EmployeeId);
                cmd.Parameters.AddWithValue("@Name", emp.Name);
                cmd.Parameters.AddWithValue("@Email", emp.Email);
                cmd.Parameters.AddWithValue("@Department", emp.Department);
                cmd.Parameters.AddWithValue("@Salary", emp.Salary);
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
