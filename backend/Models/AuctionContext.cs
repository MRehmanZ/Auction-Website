﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;


namespace AuctionBackend.Models
{
    public class AuctionContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public AuctionContext(DbContextOptions<AuctionContext> options) : base(options)
        { }


        public DbSet<AuctionRecord> AuctionRecords { get; set; }

        public DbSet<Bid> Bids { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<Auction> Auctions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuring a one-to-many relationship between ApplicationUser and Bid
            modelBuilder.Entity<ApplicationUser>()
                .HasMany(u => u.Bids)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId);

            // Configuring a one-to-many relationship between Auction and Bid
            modelBuilder.Entity<Auction>()
                .HasMany(a => a.Bids)
                .WithOne(b => b.Auction)
                .HasForeignKey(b => b.AuctionId);

            modelBuilder.Entity<AuctionRecord>()
                .HasOne(ar => ar.Auction)
                .WithMany(a => a.AuctionRecords)
                .HasForeignKey(ar => ar.AuctionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Auction)
                .WithMany(a => a.Bids)
                .HasForeignKey(b => b.AuctionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AuctionRecord>()
                .HasOne(ar => ar.Bid)
                .WithMany(b => b.AuctionRecords)
                .HasForeignKey(ar => ar.BidId)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}