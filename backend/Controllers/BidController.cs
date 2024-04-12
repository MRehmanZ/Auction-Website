using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuctionBackend.Models;
using System.Security.Claims;

namespace AuctionBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BidController : ControllerBase
    {
        private readonly AuctionContext _context;

        public BidController(AuctionContext context)
        {
            _context = context;
        }

        // GET: api/bid
        [HttpGet]
        public IActionResult GetBids()
        {
            var bids = _context.Bids.ToList();
            return Ok(new ApiResponse<IEnumerable<Bid>>(bids));
        }

        // GET: api/bid/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBid(string id)
        {
            var bid = await _context.Bids.FindAsync(id);

            if (bid == null)
            {
                return NotFound(new ApiResponse<object>("Bid not found"));
            }

            return Ok(new ApiResponse<Bid>(bid));
        }

        // POST: api/bid
        [HttpPost]
        public async Task<IActionResult> CreateBid([FromBody] Bid bid)
        {
            
            var auction = await _context.Auctions
                .Include(a => a.Bids)
                .Include(a => a.AuctionRecords)
                .FirstOrDefaultAsync(c => c.AuctionId == bid.AuctionId);

            if (auction == null)
            {
                return NotFound(new ApiResponse<object>("Auction not found"));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return BadRequest("Please login.");
            }

            var user = await _context.Users.FindAsync(userId);

            // Check if the bid Price is higher than the current highest bid
            if (bid.Price <= auction.CurrentHighestBid)
            {
                return BadRequest(new ApiResponse<object>("Bid Price must be higher than the current highest bid"));
            }

            var existingRecords = _context.AuctionRecords
                .Where(ar => ar.AuctionId == bid.AuctionId)
                .ToList();

            // Check if the bid is higher than the current highest bid
            var currentHighestBid = await _context.Bids
                .Where(b => b.AuctionId == bid.AuctionId)
                .OrderByDescending(b => ((int)b.Price))
                .FirstOrDefaultAsync();

            // Update the current highest bid
            if (currentHighestBid == null || bid.Price > currentHighestBid.Price)
            {
                // Update the auction's current highest bid
                auction.CurrentHighestBid = bid.Price;
                _context.Entry(auction).State = EntityState.Modified;
            }

            Bid newBid = new Bid
            {
                Auction = auction,
                User = user,
                UserId = userId,
                Price = bid.Price,
                AuctionRecords = auction.AuctionRecords,
                AuctionId = bid.AuctionId
            };

            var auctionRecord = new AuctionRecord
            {
                Bid = newBid,
                Auction = auction,
                AuctionId = bid.AuctionId,
                Action = AuctionRecord.Actions.PLACED,
                User = user,
                UserId = user.Id
            };

            // Assign the bid as the winner bid
            auction.WinnerBidId = bid.BidId;

            _context.Entry(auction).State = EntityState.Modified;

            auction.AuctionRecords.Add(auctionRecord);
            newBid.AuctionRecords.Add(auctionRecord);

            _context.AuctionRecords.Add(auctionRecord);
            _context.Bids.Add(newBid);


            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>("Bid placed successfully"));
        }

        // PUT: api/bid/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBid(string id, [FromBody] Bid updatedBid)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model state");
            }

            if (id != updatedBid.BidId.ToString())
            {
                return BadRequest(new ApiResponse<object>("Invalid bid ID"));
            }

            _context.Entry(updatedBid).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BidExists(id))
                {
                    return NotFound(new ApiResponse<object>("Bid not found"));
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/bid/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBid(string id)
        {
            var bid = await _context.Bids.FindAsync(Guid.Parse(id));

            if (bid == null)
            {
                return NotFound(new ApiResponse<object>("Bid not found"));
            }

            _context.Bids.Remove(bid);
            await _context.SaveChangesAsync();

            // Update the auction's current highest bid after deleting a bid
            UpdateCurrentHighestBid(bid.AuctionId.ToString());

            return NoContent();
        }

        private void UpdateCurrentHighestBid(string auctionId)
        {
            var currentHighestBid = _context.Bids
                .Where(b => b.AuctionId.ToString() == auctionId)
                .OrderByDescending(b => (int)b.Price)
                .FirstOrDefault();

            var auction = _context.Auctions.Find(auctionId);
            auction.CurrentHighestBid = currentHighestBid?.Price ?? 0;
            _context.Entry(auction).State = EntityState.Modified;
            _context.SaveChanges();
        }

        private bool BidExists(string id)
        {
            return _context.Bids.Any(b => b.BidId.ToString() == id);
        }
    }
}
