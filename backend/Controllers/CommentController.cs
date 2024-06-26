﻿using System;
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
    public class CommentController : ControllerBase
    {
        private readonly AuctionContext _context;

        public CommentController(AuctionContext context)
        {
            _context = context;
        }

        // GET: api/comment
        [HttpGet]
        public IActionResult GetComments()
        {
            var comments = _context.Comments.ToList();
            return Ok(new ApiResponse<IEnumerable<Comment>>(comments));
        }

        // GET: api/comment/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetComment(string id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                return NotFound(new ApiResponse<object>("Comment not found"));
            }

            return Ok(new ApiResponse<Comment>(comment));
        }

        // POST: api/comment
        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] Comment comment)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>("Invalid model state"));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return BadRequest("Please login.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(c => c.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var auctionId = comment.AuctionId;

            if (auctionId == Guid.Empty)
            {
                return BadRequest("AuctionId is required.");
            }

            var auction = await _context.Auctions
                .Include(a => a.Comments)
                .FirstOrDefaultAsync(a => a.AuctionId == auctionId);

            if (auction == null)
            {
                return NotFound("Auction not found");
            }

            // Set the UserId and User properties
            comment.UserId = userId;
            auction.Comments.Add(comment);
            
            _context.Comments.Add(comment);
            _context.Entry(auction).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { id = comment.CommentId.ToString() }, new ApiResponse<Comment>(comment));
        }


        // PUT: api/comment/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(string id, [FromBody] Comment updatedComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>("Invalid model state"));
            }

            if (id != updatedComment.CommentId.ToString())
            {
                return BadRequest(new ApiResponse<object>("Invalid comment ID"));
            }

            _context.Entry(updatedComment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
                {
                    return NotFound(new ApiResponse<object>("Comment not found"));
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/comment/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(string id)
        {
            var comment = await _context.Comments.FindAsync(Guid.Parse(id));

            if (comment == null)
            {
                return NotFound(new ApiResponse<object>("Comment not found"));
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(string id)
        {
            return _context.Comments.Any(c => c.CommentId.ToString() == id);
        }
    }
}
