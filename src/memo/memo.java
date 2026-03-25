@Component
public class CustomBasicAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            // ✅ 여기서 성공 처리
            System.out.println("인증 성공: " + auth.getName());
        }

        filterChain.doFilter(request, response);
    }
}
