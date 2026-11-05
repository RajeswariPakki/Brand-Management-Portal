using System.ComponentModel.DataAnnotations;

namespace CRUDOperations.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public string Role { get; set; } = "User";
    }
}