import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userApi } from "../services/api";
import Avatar from "../components/ui/Avatar";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";

export default function UserSearchPage() {
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;
		userApi
			.getAll()
			.then((res) => {
				if (active) setUsers(res.data);
			})
			.catch(() => {
				if (active)
					setError("No se pudieron cargar los usuarios. Inténtalo de nuevo.");
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const filtered = query.trim()
		? users.filter((u) =>
				u.username.toLowerCase().includes(query.trim().toLowerCase()),
			)
		: users;

	return (
		<div className="fade-in">
      <PageHeader
        align="center"
        eyebrow="Comunidad"
        title="Usuarios"
        description="Toda la comunidad. Encuentra usuarios y mira las canciones que han votado"
      />

			<form
				onSubmit={(e) => e.preventDefault()}
				style={{
					maxWidth: 460,
					marginBottom: "var(--space-5)",
					display: "flex",
					gap: "var(--space-2)",
				}}
			>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Filtrar por nombre de usuario..."
					aria-label="Filtrar usuarios"
				/>
			</form>

			{loading && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 6,
						maxWidth: 460,
					}}
				>
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="card skeleton"
							style={{ height: 70, borderRadius: "var(--radius-md)" }}
						/>
					))}
				</div>
			)}

			{!loading && error && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						color: "var(--danger)",
						fontSize: 14,
						maxWidth: 460,
					}}
				>
					<Icon name="alert" size={18} />
					<span>{error}</span>
				</div>
			)}

			{!loading && !error && filtered.length === 0 && (
				<EmptyState
					icon="search"
					title={
						users.length === 0
							? "Aún no hay usuarios"
							: "No se encontraron usuarios"
					}
					description={
						users.length === 0
							? "Cuando alguien se registre aparecerá aquí."
							: `No hay resultados para "${query}".`
					}
					style={{ maxWidth: 460 }}
				/>
			)}

			{!loading && !error && filtered.length > 0 && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 6,
						maxWidth: 460,
					}}
				>
					{filtered.map((u) => (
						<Link
							key={u.id}
							to={`/users/${u.username}`}
							style={{ textDecoration: "none" }}
						>
							<div
								className="card card-hover"
								style={{
									display: "flex",
									alignItems: "center",
									gap: 14,
									padding: "14px 18px",
								}}
							>
								<Avatar username={u.username} size={42} />
								<div style={{ minWidth: 0 }}>
									<div
										style={{
											fontWeight: 600,
											fontSize: 15,
											color: "var(--text-primary)",
											fontFamily: "var(--font-display)",
										}}
									>
										{u.username}
									</div>
									<div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
										{u.email}
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
