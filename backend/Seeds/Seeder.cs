using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using AuctionBackend.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace AuctionBackend.Seeds
{
    public static class Seeder
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using (var context = new AuctionContext(services.GetRequiredService<DbContextOptions<AuctionContext>>()))
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            await CreateRoles(roleManager);

            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                
            await CreateUser(userManager, "Admin", "mrz707@outlook.com", "@Hello1234");
            await CreateUser(userManager, "User", "emailtestreceive@gmail.com", "@ABcd1234");

            if (!context.Categories.Any())
                {
                    await CreateCategory(context, "Electronics");
                    await CreateCategory(context, "Antiques");
                    await CreateCategory(context, "Cars");
                    await CreateCategory(context, "Paintings");
                }

            var user = await userManager.FindByEmailAsync("mrz707@outlook.com");
            if (user != null && !context.Auctions.Any())
            {
                await CreateAuctionItem(context, user);
            }
        }
    }

    private static async Task CreateRoles(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = { "Admin", "User" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }

    private static async Task CreateUser(UserManager<ApplicationUser> userManager, string role, string sampleEmail, string samplePassword)
    {
        if (await userManager.FindByEmailAsync(sampleEmail) == null)
        {
            var user = new ApplicationUser
            {
                Email = sampleEmail,
                UserName = sampleEmail,
                Password = samplePassword
            };

            await userManager.CreateAsync(user, user.Password);
            await userManager.AddToRoleAsync(user, role);
            await userManager.ConfirmEmailAsync(user, await userManager.GenerateEmailConfirmationTokenAsync(user));
        }
    }

    private static async Task CreateCategory(AuctionContext context, string sampleName)
    {
        var category = new Category
        {
            Name = sampleName,
            Auctions = new List<Auction>()
        };

        context.Categories.Add(category);
        await context.SaveChangesAsync();
    }

    private static async Task CreateAuctionItem(AuctionContext context, ApplicationUser user)
    {
        var auctionItem = new Auction
        {
            Name = "Television",
            Condition = Auction.ItemCondition.NEW,
            Description = "Recently refurbished, but new condition",
            UserId = user.Id,
            IsActive = true,
            Price = 590
        };

        var category = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Electronics");
        if (category != null)
        {
            auctionItem.CategoryId = category.CategoryId;
            category.Auctions.Add(auctionItem);
        }

        context.Auctions.Add(auctionItem);
        await context.SaveChangesAsync();
        }
    }

}