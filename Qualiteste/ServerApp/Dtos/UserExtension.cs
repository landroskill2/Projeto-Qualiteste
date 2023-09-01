using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;
public partial class User
{
    public UserDto toOutputModel()
    {
        return new UserDto 
        {
            Username = Username,
            Role = RoleNavigation?.Roledesignation,
            Designation = Client?.Designation
        };
    }
}