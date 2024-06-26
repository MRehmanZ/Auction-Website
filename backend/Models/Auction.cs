﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using AuctionBackend.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionBackend.Models
{
    public class Auction
    {
        public Auction()
        {
            Bids = new HashSet<Bid>();
            Comments = new List<Comment>();
            AuctionRecords = new List<AuctionRecord>();
        }
        public enum ItemCondition
        {
            NEW,
            EXCELLENT,
            GOOD,
            USED,
            REFURBISHED,
            POOR
        }

        [Key]
        public Guid AuctionId { get; set; }

        [Required]
        public string Name { get; set; }
        
        public ItemCondition Condition { get; set; }

        [Required]
        public string Description { get; set; }

        [ForeignKey("UserId")]
        public Guid UserId { get; set; }

        // Foreign key relationship with Category
        [ForeignKey("CategoryId")]
        public Guid CategoryId { get; set; }

        public string? CategoryName { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public DateTime ExpiryDate { get; set; }

        [Precision(18, 2)]
        public decimal Price { get; set; }
        
        public int NumberOfBids { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;

        public Guid? WinnerBidId { get; set; }

        public decimal CurrentHighestBid { get; set; }

        public string? ImageUrl { get; set; }

        // Collection navigation property for Bids placed by the user
        public ICollection<Bid> Bids { get; set; }

        public ICollection<Comment> Comments { get; set; }
        
        public ICollection<AuctionRecord> AuctionRecords { get; set; }

    }
}
