using System.ComponentModel.DataAnnotations;

namespace CRUDOperations.Models
{
    public class Brand
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "Brand Name is required")]
        [StringLength(100, ErrorMessage = "Brand Name cannot exceed 100 characters")]
        public string? Name { get; set; }
        [Required(ErrorMessage = "Category is required")]
        [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
        public string? Category { get; set; }
        public int IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}