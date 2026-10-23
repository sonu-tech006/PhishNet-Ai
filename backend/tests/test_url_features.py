import unittest
import math

def calculate_shannon_entropy(s: str) -> float:
    if not s:
        return 0.0
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    entropy = 0.0
    length = len(s)
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 3)

class TestURLFeatures(unittest.TestCase):
    def test_shannon_entropy(self):
        self.assertEqual(calculate_shannon_entropy("aaaaaaa"), 0.0)
        h1 = calculate_shannon_entropy("abcdefg")
        self.assertGreater(h1, 2.5)

    def test_ip_detection(self):
        ip_url = "185.220.101.5:8080/auth"
        host = ip_url.split("/")[0].split(":")[0]
        parts = host.split(".")
        is_ip = len(parts) == 4 and all(p.isdigit() for p in parts)
        self.assertTrue(is_ip)

        domain_url = "github.com/learn"
        host2 = domain_url.split("/")[0].split(":")[0]
        parts2 = host2.split(".")
        is_ip2 = len(parts2) == 4 and all(p.isdigit() for p in parts2)
        self.assertFalse(is_ip2)

    def test_punycode_detection(self):
        self.assertIn("xn--", "http://xn--pple-43d.com")
        self.assertNotIn("xn--", "https://apple.com")

if __name__ == '__main__':
    unittest.main()
