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

public class RegisterRequest
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}

public class RegisterResponse
{
    public string Token    { get; set; } = "";
    public string Username { get; set; } = "";
    public string Role     { get; set; } = "";
}

public class UserAdminDto
{
    public int      Id        { get; set; }
    public string   Username  { get; set; } = "";
    public string?  Email     { get; set; }
    public string   Role      { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class UserUpdateRequest
{
    public string? Username { get; set; }
    public string? Email    { get; set; }
    public string? Role     { get; set; }
    public string? Password { get; set; }
}

public class UserListResponse
{
    public List<UserAdminDto> Items { get; set; } = [];
    public int                Total { get; set; }
}
