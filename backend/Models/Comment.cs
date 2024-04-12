using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionBackend.Models
{
    public class Comment
    {
        [Key]
        public Guid CommentId { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        public DateTime DateCreated { get; set; } = DateTime.Now;

        // Foreign key relationship with ApplicationUser
        [ForeignKey("UserId")]
        public Guid UserId { get; set; }

        // Foreign key relationship with Auction
        [ForeignKey("AuctionId")]
        public Guid AuctionId { get; set; }
    }
}
