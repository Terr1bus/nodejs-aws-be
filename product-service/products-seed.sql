create table products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text default null,
  price integer not null,
);

insert into products (title, description, price)
  values
    ('Training lightsaber', 'The weakest and most harmless type of lightsaber is the one that has been “baby-proofed”: the training lightsabers', 1),
    ('Lightsiber pike', 'These weapons have a much longer handle than usual, and the handle is made of a material called phrik alloy, which is very resistant to other lightsabers. The blades in these lightsabers are also much shorter and slightly thicker in comparison to standard ones', 2),
    ('Qichani', 'The Qichani is a curious type of lightsaber that is attached to a very long staff wrapped in a material called cortosis fiber. This material serves as a protection for the staff from being cut down easily by other lightsabers', 3),
    ('Lightsaber cane / Sabercane', 'The cane-shaped hilt of a Sabercane allows this lightsaber to be one of the most inconspicuous weapons. At first glance, it simply looks like a cane, and nothing else', 4),
    ('Short lightsaber / Shoto', 'Shoto is the nickname for a type of short lightsabers, which are standard single-bladed weapons who just so happen to be shorter (and smaller) than the average ones, in an attempt to provide comfort and agility to those who wield it. Unlike the training lightsaber, which is also a smaller version of a single-bladed lightsaber, the Shoto is a fully-functioning weapon made for people or creatures of a smaller stature', 5),
    ('Great lightsaber', 'The Great Lightsaber is the complete opposite of a Shoto: it is a standard single-bladed lightsaber with a much longer blade and enlarged hilt. Made for people and creatures of a larger-than-average size, the Great Lightsaber’s blade could measure up to 3 meters (nearly 10 feet) in length', 5),
    ('Dual-phase', 'The dual-phase lightsaber is an uncommon type of single-bladed lightsabers that uses a particular combination of focusing crystals to allow the blade to extend two times longer than its original length. The surprising additional length of the blade often serves as a threatening tool to opponents, but it also allows wielders to attack from a farther range', 6),
    ('Single-bladed', 'The single-bladed lightsaber is the standard type of lightsabers', 7),
    ('Underwater lightsaber', 'An underwater lightsaber is a single-bladed lightsaber that was modified to work underwater. Most lightsabers – single-bladed or otherwise – short out once the blade touches water, but an underwater lightsaber is powered by two crystals that yield a bifurcating cyclical-ignition pulse, meaning that the blade will keep working even when it is submerged', 8),
    ('Curved-hilt', 'Another slight variation to the standard single-bladed lightsaber is the curved-hilt type. Though the curved hilt design poses a more challenging construction of the lightsaber during the process of aligning its crystals into place, a curved-hilt lightsaber gives its wielders a better grip and, therefore, allows them to have more precise movements during a lightsaber-to-lightsaber battle. This type of hilt is also more malleable within one’s grasp, meaning that attacks can be struck from many different angles that a standard single-bladed lightsaber could probably not bend to', 9),
    ('Darksaber', 'This is a lightsaber with an obsidian-black blade that is surrounded by a ghastly white aura. It has an angular, one-of-a-kind hilt and sounds completely different from other lightsabers', 17),
    ('Forked / Crossguard lightsaber', 'The crossguard lightsaber was an ancient design of lightsabers that date back to the Great Scourge of Malachor. It is essentially a standard, twin-bladed lightsaber with a forked hilt – meaning that the weapon has a second emitter at a 45-degree angle to the axis of the hilt where a short, “sideways” beam of light is discharged.', 10),
    ('Interlocked / Paierd lightsabers', 'Interlocking lightsabers are a pair of curved-hilt lightsabers that are used in unison. This pair of lightsabers can be linked through a fiber cord (becoming a sort of double-bladed lightsaber) or used separately, depending on the need of the battle. The biggest advantage in this combination of weapons is that its wielders can strike from surprising angles, as well as having the ability to defend themselves while attacking', 12),
    ('Lightwhip', 'This is a very rare type of lightsaber. The Lightwhip has got to be among the strongest and most menacing types of weapons. It requires a special training to wield a Lightwhip. Unlike the standard lightsaber’s stiffly erect beam of energy (which resembles a blade), the Lightwhip emits a continuous beam of energy that is much longer and entirely malleable (like a whip)', 13),
    ('Double-bladed lightsaber / Saberstaff', 'The double-bladed lightsaber, also known as Saberstaff, essentially makes the case that, when it comes to weapons, “two is better than one” and “the bigger, the better.”', 14),
    ('Inquisitorious lightsaber', 'There is such a thing as a double-bladed spinning', 15)
;

create table stock (
  product_id uuid primary key,
  count integer not null,
  foreign key (product_id) references products on delete cascade
);

insert into stock select id, 1 from products;
