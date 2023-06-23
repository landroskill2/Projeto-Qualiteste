namespace Qualiteste.ServerApp.Utils
{
    public class TokenSettings
    {
        public static string Issuer { get => "Qualiteste"; }
        public static string Audience { get => "Qualiteste"; }
        public static string Key { get => "randomsecret87654321213456789012"; }
        public static DateTime Expiration { get => DateTime.Now.AddDays(7); }
    }
}