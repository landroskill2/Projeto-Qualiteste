using System.Text;

public static class SHA256Encryption
{
    public static string EncryptString(string str)
    {
        return string.Concat(System.Security.Cryptography.SHA256.Create()
            .ComputeHash(Encoding.UTF8.GetBytes(str))
            .Select(item => item.ToString("x2")));
    }
}