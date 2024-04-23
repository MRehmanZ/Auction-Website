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
    
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionController : ControllerBase
    {
        private readonly AuctionContext _context;
        private readonly string _mediaFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "media");

        public AuctionController(AuctionContext context)
        {
            _context = context;
        }

        [HttpGet("my-auctions")]
        public async Task<ActionResult> GetMyAuctions()
        {
            // Get the user ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return BadRequest("Please login.");
            }

            try
            {
                // Fetch auctions associated with the user
                var auctions = await _context.Auctions
                    .Where(a => a.UserId == userId)
                    .ToListAsync();

                return Ok(auctions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving auctions: {ex.Message}");
            }
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var file = Request.Form.Files[0];
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                if (!Directory.Exists(_mediaFolderPath))
                {
                    Directory.CreateDirectory(_mediaFolderPath);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(_mediaFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = Path.Combine("media", fileName);
                return Ok(new { imageUrl = relativePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        // GET: api/auction
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAuctions()
        {
            try
            {
                // Use _context to retrieve auctions for the specific user
                var userAuctions = _context.Auctions
                    .ToList();

                return Ok(userAuctions);
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/auction/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuction(string id)
        {
            var auction = await _context.Auctions
                .Include(a => a.Bids) // Include the bids navigation property
                .Include(a => a.Comments) // Include the comments navigation property
                .FirstOrDefaultAsync(a => a.AuctionId.Equals(new Guid(id)));

            if (auction != null)
            {
                var bids = auction.Bids.ToList();
                // Now 'bids' contains the list of bids associated with the auction
            }

            if (auction == null)
            {
                return NotFound(new ApiResponse<object>("Auction not found"));
            }

            return Ok(new ApiResponse<Auction>(auction));
        }

        // POST: api/auction
        [HttpPost]
        public async Task<IActionResult> CreateAuction([FromBody] Auction auction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>("Invalid model state"));
            }

            // Initialize properties
            auction.CurrentHighestBid = 0;
            auction.WinnerBidId = null;

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return BadRequest("Please login.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(c => c.Id.ToString() == userId.ToString());

            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name.ToLower().Equals(auction.CategoryName.ToLower()));

            // Create a new auction
            var newAuction = new Auction
            {
                Name = auction.Name,
                Description = auction.Description,
                CategoryId = category.CategoryId,
                CategoryName = auction.CategoryName,
                UserId = userId,
                Condition = auction.Condition,
                ExpiryDate = auction.ExpiryDate,
                Price = auction.Price,
                IsActive = auction.IsActive,
                ImageUrl = auction.ImageUrl,

                Bids = new List<Bid>(),
                Comments = new List<Comment>(),
                AuctionRecords = new List<AuctionRecord>()
            };

            category.Auctions.Add(newAuction);

            _context.Auctions.Add(newAuction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAuction", new { id = newAuction.AuctionId }, new ApiResponse<Auction>(newAuction));
        }

        // PUT: api/auction/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuction(string id, [FromBody] Auction updatedAuction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model state");
            }

            if (id != updatedAuction.AuctionId.ToString())
            {
                return BadRequest(new ApiResponse<object>("Invalid auction ID"));
            }

            _context.Entry(updatedAuction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuctionExists(id))
                {
                    return NotFound(new ApiResponse<object>("Auction not found"));
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/auction/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuction(string id)
        {
            var auction = await _context.Auctions.FindAsync(Guid.Parse(id));

            if (auction == null)
            {
                return NotFound(new ApiResponse<object>("Auction not found"));
            }

            // Delete related records in AuctionRecords table
            var auctionRecords = _context.AuctionRecords.Where(ar => ar.AuctionId == auction.AuctionId);
            _context.AuctionRecords.RemoveRange(auctionRecords);

            var bids = _context.Bids.Where(b => b.AuctionId == auction.AuctionId);
            _context.Bids.RemoveRange(bids);

            // Remove auction from category
            var category = _context.Categories.FirstOrDefault(c => c.CategoryId.ToString() == auction.CategoryId.ToString());
            if (category != null)
            {
                category.Auctions.Remove(auction);
            }

            // Remove auction
            _context.Auctions.Remove(auction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/auction/{id}/place-bid
        [HttpPost("{id}/place-bid")]
        public async Task<IActionResult> PlaceBid(string id, [FromBody] Bid bid)
        {
            if (!Guid.TryParse(id, out Guid auctionId))
            {
                return BadRequest("Invalid auction ID");
            }

            var auction = await _context.Auctions
                .Include(a => a.Bids)
                .Include(a => a.AuctionRecords)
                .FirstOrDefaultAsync(c => c.AuctionId == auctionId);

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
                AuctionId = auctionId
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

            //_context.Entry(auction).State = EntityState.Modified;

            auction.Bids.Add(newBid);

            auction.AuctionRecords.Add(auctionRecord);
            newBid.AuctionRecords.Add(auctionRecord);

            _context.AuctionRecords.Add(auctionRecord);
            _context.Bids.Add(newBid);


            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log any exceptions
                Console.WriteLine($"Error saving changes: {ex}");
                throw; // Rethrow the exception to maintain original behavior
            }

            return Ok(new ApiResponse<object>("Bid placed successfully"));
        }

        private bool AuctionExists(string id)
        {
            return _context.Auctions.Any(a => a.AuctionId.ToString() == id);
        }

        private Guid GetGuid(string stringId)
        {
            if (!Guid.TryParse(stringId, out var guid))
            {
                // Handle invalid ID format
                return Guid.Empty;
            }

            return guid;
        }
    }
}
