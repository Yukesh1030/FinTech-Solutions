import os
import io
import sys
from PIL import Image

def get_webp_bytes(img, scale=1.0, quality=80):
    w = max(20, int(img.size[0] * scale))
    h = max(20, int(img.size[1] * scale))
    if scale != 1.0:
        im = img.resize((w, h), Image.Resampling.LANCZOS)
    else:
        im = img
    buf = io.BytesIO()
    im.save(buf, format='WEBP', quality=int(quality), method=4)
    return buf.getvalue()

def optimize_image_to_range(img, min_kb=71, max_kb=89):
    target_kb = (min_kb + max_kb) / 2.0
    best_data = None
    best_diff = float('inf')
    
    # Try different scales
    scales = [1.0, 0.9, 0.8, 1.1, 1.2, 0.7, 1.3, 1.5, 1.8, 2.0, 2.5, 0.6, 0.5, 3.0, 4.0]
    for scale in scales:
        # Binary search quality between 20 and 98
        low, high = 20, 98
        while low <= high:
            mid = (low + high) // 2
            data = get_webp_bytes(img, scale, mid)
            kb = len(data) / 1024.0
            if min_kb <= kb <= max_kb:
                return data, kb
            diff = abs(kb - target_kb)
            if diff < best_diff:
                best_diff = diff
                best_data = data
            if kb < target_kb:
                low = mid + 2
            else:
                high = mid - 2
                
    # If still not in range, padding / fine tune
    if best_data and (len(best_data)/1024.0) < min_kb:
        for s in [2.5, 3.0, 3.5, 4.0, 5.0]:
            data = get_webp_bytes(img, s, 95)
            kb = len(data) / 1024.0
            if min_kb <= kb <= max_kb:
                return data, kb
            if kb > max_kb:
                # binary search
                l, h = 40, 95
                while l <= h:
                    m = (l + h) // 2
                    d = get_webp_bytes(img, s, m)
                    k = len(d) / 1024.0
                    if min_kb <= k <= max_kb:
                        return d, k
                    if k < target_kb:
                        l = m + 1
                    else:
                        h = m - 1
                        
    return best_data, len(best_data) / 1024.0

def process_all():
    assets_dir = 'Assets'
    output_dirs = [
        'Assets',
        'assets/images',
        'assets/images/hero',
        'assets/images/payments',
        'assets/images/analytics',
        'assets/images/business',
        'assets/images/security',
        'assets/images/about'
    ]
    for d in output_dirs:
        os.makedirs(d, exist_ok=True)
        
    files = {
        'Brand-logo.webp': 'Brand-logo.webp',
        'index page bg cover.jpeg': 'index-bg-cover.webp',
        'cover.jpeg': 'cover.webp',
        'Cover2.jpeg': 'cover2.webp',
        'Billing & Invoicing.jpeg': 'billing-invoicing.webp',
        'Connected Financial Experience.jpeg': 'connected-financial-experience.webp',
        'Customer Stories.jpeg': 'customer-stories.webp',
        'Financial Performance at a Glance.jpeg': 'financial-performance.webp',
        'Real-Time Financial Insights.jpeg': 'real-time-financial-insights.webp',
        'Security & Trust.jpeg': 'security-trust.webp',
        'Solutions for Every Business.jpeg': 'solutions-every-business.webp',
        'card.jpeg': 'card.webp',
        'user.jpeg': 'user.webp',
    }
    
    for src_name, dst_name in files.items():
        src_path = os.path.join(assets_dir, src_name)
        if not os.path.exists(src_path):
            continue
        img = Image.open(src_path)
        data, size_kb = optimize_image_to_range(img, min_kb=71, max_kb=89)
        
        # Save to Assets/
        out_path1 = os.path.join('Assets', dst_name)
        with open(out_path1, 'wb') as f:
            f.write(data)
            
        # Also save to assets/images/
        out_path2 = os.path.join('assets/images', dst_name)
        with open(out_path2, 'wb') as f:
            f.write(data)
            
        print(f"Generated {dst_name}: {size_kb:.2f} KB (Target: 70-90KB)", flush=True)
        
    # Copy to subdirectories for semantic organization
    subfolder_map = {
        'cover.webp': 'assets/images/hero/cover.webp',
        'index-bg-cover.webp': 'assets/images/hero/index-bg-cover.webp',
        'card.webp': 'assets/images/payments/card.webp',
        'real-time-financial-insights.webp': 'assets/images/analytics/real-time-financial-insights.webp',
        'financial-performance.webp': 'assets/images/analytics/financial-performance.webp',
        'solutions-every-business.webp': 'assets/images/business/solutions-every-business.webp',
        'connected-financial-experience.webp': 'assets/images/business/connected-financial-experience.webp',
        'security-trust.webp': 'assets/images/security/security-trust.webp',
        'user.webp': 'assets/images/about/user.webp',
        'customer-stories.webp': 'assets/images/about/customer-stories.webp',
        'cover2.webp': 'assets/images/hero/cover2.webp',
        'billing-invoicing.webp': 'assets/images/payments/billing-invoicing.webp',
    }
    for orig, dest in subfolder_map.items():
        src = os.path.join('Assets', orig)
        if os.path.exists(src):
            with open(src, 'rb') as f_in:
                d = f_in.read()
            with open(dest, 'wb') as f_out:
                f_out.write(d)
                
    print("\n--- Summary of all .webp files in Assets/ ---", flush=True)
    for f in sorted(os.listdir('Assets')):
        if f.endswith('.webp'):
            sz = os.path.getsize(os.path.join('Assets', f)) / 1024.0
            print(f"  Assets/{f:35}: {sz:.2f} KB", flush=True)

if __name__ == '__main__':
    process_all()
