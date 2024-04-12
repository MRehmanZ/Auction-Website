using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionBackend.Models
{
    public class AssignRoleModel
    {
        [ForeignKey("UserId")]
        public Guid UserId { get; set; }
        public string RoleName { get; set; }
    }
}
