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

            if (!context.Categories.Any())
                {
                    await CreateCategory(context, "Electronics");
                    await CreateCategory(context, "Antiques");
                    await CreateCategory(context, "Cars");
                    await CreateCategory(context, "Paintings");
                    await CreateCategory(context, "Collectibles");
                }

            var user = await userManager.FindByEmailAsync("mrz707@outlook.com");
            if (user != null && !context.Auctions.Any())
            {
                await CreateAuctionItem(context, user, "Television", Auction.ItemCondition.NEW, 
                    "Recently refurbished, but new condition", 
                    "https://media.currys.biz/i/currysprod/10248449?$l-large$&fmt=auto", 
                    780, 12, "Electronics");
                await CreateAuctionItem(context, user, "Mercedes Benz G500", Auction.ItemCondition.USED,
                    "This example, featuring a 5.0L 292hp V8, 5-Speed automatic, and hi/lo range 4wd transfer case, with triple locker differentials, is finished in Tectite Gray Metallic over black leather interior, and is optioned with heated seats, sunroof, cd changer, navigation, bose premium stereo system, and upgraded black 19\" G55 AMG wheels. ",
                    "https://p1.liveauctioneers.com/5250/202945/105067323_1_x.jpg?quality=80&version=1621634637", 
                    40000, 25, "Cars");
                await CreateAuctionItem(context, user, "Vincent Van Gogh Dutch Oil on Canvas painting", Auction.ItemCondition.NEW,
                    "The painting depicts a tranquil rural scene, with a cozy house nestled amidst a golden yellow field. In the foreground, a man carrying his work tools suggests the completion of a day's labor, evoking a sense of contentment and the journey homeward.",
                    "https://p1.liveauctioneers.com/5582/326438/175763977_1_x.jpg?quality=80&version=1713484803",
                    2050, 8, "Paintings");
                await CreateAuctionItem(context, user, "Fine chinese peking glass", Auction.ItemCondition.REFURBISHED,
                    "The fine chinese snuff bottle is enameled with much detail, depicting immortals with children around them. The colors are vivid and harmonious. The background is deep blue. The bottle carries a qianlong mark.",
                    "https://p1.liveauctioneers.com/6807/316653/175390337_1_x.jpg?quality=80&version=1712862993",
                    90, 9, "Antiques");
                await CreateAuctionItem(context, user, "Chinese Export Famille Rose Plate", Auction.ItemCondition.EXCELLENT,
                    "Qing Dynasty, 18th Century",
                    "https://p1.liveauctioneers.com/8283/326218/175616028_1_x.jpg?quality=80&version=1713035311",
                    200, 20, "Antiques");
                await CreateAuctionItem(context, user, "Ferrari", Auction.ItemCondition.NEW,
                    "Mid-engine, plug-in hybrid V8 sports car.",
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Red_2019_Ferrari_SF90_Stradale_%2848264238897%29_%28cropped%29.jpg/200px-Red_2019_Ferrari_SF90_Stradale_%2848264238897%29_%28cropped%29.jpg",
                    300000, 25, "Cars");
                await CreateAuctionItem(context, user, "Shriners Parade Car Alpha Romeo", Auction.ItemCondition.GOOD,
                    "Red 1/2 scale Alfa Romeo go-cart comprised of a steel frame, wood and spray foam body, and fitted with a gas powered Honda 200 engine. This go-cart is in fine running order and has drove proudly in many south eastern New england Shriners Parade.",
                    "https://p1.liveauctioneers.com/3954/325566/175258458_1_x.jpg?quality=80&version=1712583256",
                    1000, 12, "Cars");
                await CreateAuctionItem(context, user, "Chinese resin snuff bottle", Auction.ItemCondition.GOOD,
                    "The beautiful Chinese resin snuff bottle features flower trees , a monkey and a rabbit. The bottle is 2.5 inches tall.",
                    "https://p1.liveauctioneers.com/6807/316653/175390597_1_x.jpg?quality=80&version=1712862993",
                    70, 7, "Collectibles");
                await CreateAuctionItem(context, user, "2013 Bentley Mulsanne", Auction.ItemCondition.EXCELLENT,
                    "The 2013 Bentley Mulsanne with only 14,650 miles is a rare and exceptional luxury vehicle. Features: custom two tone beige and navy vinyl wrap, Exclusive Cashew two-tone leather interior with blue piping that exudes opulence. This meticulously maintained vehicle offers a pristine driving experience.",
                    "https://p1.liveauctioneers.com/1512/326884/176002808_1_x.jpg?quality=80&version=1713646397",
                    35000, 22, "Cars");
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

    private static async Task CreateAuctionItem(AuctionContext context, ApplicationUser user, string auctionName, Auction.ItemCondition condition, string description, string imageUrl, int price, int expiryAddDays, string categoryName)
    {
            var auctionItem = new Auction
            {
                Name = auctionName,
                Condition = condition,
                Description = description,
                UserId = user.Id,
                IsActive = true,
                ImageUrl = imageUrl,
                Price = price,
                ExpiryDate = DateTime.Now.AddDays(expiryAddDays)
            };

        var category = await context.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
        if (category != null)
        {
            auctionItem.CategoryId = category.CategoryId;
            auctionItem.CategoryName = category.Name;
            category.Auctions.Add(auctionItem);
        }

        context.Auctions.Add(auctionItem);
        await context.SaveChangesAsync();
        }
    }

}