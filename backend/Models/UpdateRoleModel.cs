using System.ComponentModel.DataAnnotations;

namespace AuctionBackend.Models;
public class UpdateRoleModel
{
    public enum Role
    {
        ADMIN,
        USER
    }

    [Key]
    public string RoleId { get; set; }
    public string NewRoleName { get; set; }
}