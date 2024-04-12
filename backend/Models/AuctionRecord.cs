using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AuctionBackend.Models
{
    public class AuctionRecord
    {
        public AuctionRecord()
        {
            this.BidRecords = new HashSet<Bid>();
        }

        public enum Actions
        {
            PLACED,
            UPDATED,
            REMOVED
        }

        [Key]
        public Guid AuctionRecordId { get; set; }
        public DateTime RecordTime { get; set; }
        public Actions Action { get; set; } 

        [ForeignKey("BidId")]
        // Additional properties related to bid information
        public Guid BidId { get; set; }
        public Bid Bid { get; set; }

        public ICollection<Bid> BidRecords { get; set; }

        // Foreign key relationship with ApplicationUser
        [ForeignKey("UserId")]
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; }

        // Foreign key relationship with Auction
        [ForeignKey("AuctionId")]
        public Guid AuctionId { get; set; }
        public Auction Auction { get; set; }

    }
}
