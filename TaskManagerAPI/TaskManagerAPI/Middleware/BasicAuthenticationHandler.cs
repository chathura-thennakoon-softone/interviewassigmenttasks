using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Middleware
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IAuthService _authService;
        
        public BasicAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger, UrlEncoder encoder, IAuthService authService)
            : base(options, logger, encoder)
        {
            _authService = authService;
        }
        
        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
            {
                return AuthenticateResult.Fail("Missing Authorization Header");
            }
            
            try
            {
                var encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
                var credentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
                var parts = credentials.Split(':', 2);
                
                if (parts.Length != 2)
                {
                    return AuthenticateResult.Fail("Invalid Authorization Header");
                }
                
                var username = parts[0];
                var password = parts[1];
                
                var user = await _authService.LoginAsync(username, password);
                
                if (user == null)
                {
                    return AuthenticateResult.Fail("Invalid Username or Password");
                }
                
                var claims = new[]
                {
                    new System.Security.Claims.Claim("UserId", user.Id.ToString()),
                    new System.Security.Claims.Claim("Username", user.Username),
                    new System.Security.Claims.Claim("Email", user.Email)
                };
                
                var identity = new System.Security.Claims.ClaimsIdentity(claims, Scheme.Name);
                var principal = new System.Security.Claims.ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);
                
                return AuthenticateResult.Success(ticket);
            }
            catch
            {
                return AuthenticateResult.Fail("Invalid Authorization Header");
            }
        }
        
        protected override Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            Response.Headers["WWW-Authenticate"] = "Basic";
            Response.StatusCode = 401;
            return Task.CompletedTask;
        }
        
        protected override Task HandleForbiddenAsync(AuthenticationProperties properties)
        {
            Response.StatusCode = 403;
            return Task.CompletedTask;
        }
    }
}
