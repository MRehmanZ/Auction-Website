using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionBackend.Models
{
    public class Category
    {
        public Category()
        {
            this.Auctions = new HashSet<Auction>();
        }

        [Key]
        public Guid CategoryId { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<Auction> Auctions { get; set; }
    }
}
