namespace Web_aplication.Domain.Models.Auth;

public class LoginRequest
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}

public class LoginResponse
{
    public string Token    { get; set; } = "";
    public string Username { get; set; } = "";
    public string Role     { get; set; } = "";
}

public class SessionUser
{
    public string Username { get; set; } = "";
    public string Role     { get; set; } = "";
}
