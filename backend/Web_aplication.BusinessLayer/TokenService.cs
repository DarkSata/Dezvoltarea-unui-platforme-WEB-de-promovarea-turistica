using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Web_aplication.DataAccess;

namespace Web_aplication.BusinessLayer;

public class TokenService
{
    public static string GenerateToken(string username, string role)
    {
        var key         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSettings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiry      = DateTime.UtcNow.AddHours(JwtSettings.ExpiryHours);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer:            JwtSettings.Issuer,
            audience:          JwtSettings.Audience,
            claims:            claims,
            expires:           expiry,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
